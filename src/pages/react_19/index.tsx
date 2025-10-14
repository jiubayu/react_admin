// useApi 允许在渲染中读取数据
import {
  useActionState,
  useState,
  useTransition,
  use,
  Suspense,
  useRef,
} from 'react';

const lists = [
  Promise.resolve({id: 1, text: '111'}),
  new Promise((resolve) =>
    setTimeout(() => resolve({id: 2, text: '222'}), 1000)
  ),
];

const getData = fetch(`/api/toutiao?key=36de5db81215`).then((response) =>
  response.json()
);

function React19() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef(null);

  // 新的hook useActionState
  const [err, submitAction, isPendings] = useActionState(async () => {
    const error = await fetch(`/api/toutiao?key=36de5db81215`);
    if (error) {
      return error;
    }
    confirm('更新成功');
    return null;
  }, null);

  // Actions(动作)
  // 简化了异步操作的处理，自动管理代处理状态，错误，乐观更新和表单提交。
  // 开发者用useTransition来处理待处理状态，确保UI在数据变化时保持响应性
  const handleSubmit = () => {
    startTransition(() => {
      fetch(`/api/toutiao?key=36de5db81215`)
        .then((res) => res.json())
        .then(
          (data) => setName(data.id),
          (error) => setError(error)
        );
    });
  };

  const handleFocus = () => {
    console.log('focus');
    if (inputRef.current) {
      (inputRef.current as HTMLInputElement).focus();
    }
  };

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
      <br />
      <form action={submitAction}>
        <input type='text' name='name' />
        <button type='submit' disabled={isPendings}>
          Update
        </button>
        {err && <p>err</p>}
      </form>
      <Page commentsPromise={lists} />
      <MyInput
        placeholder='请输入name'
        ref={inputRef}
        handleFocus={handleFocus}
      />
      {/* 支持文档元素 */}
      <title>react 全家桶学习</title>
      <meta name='author' content='jiuyu' />
      <meta name='description' content='react 全家桶学习' />
      useDeferredValue
      <Search />
    </div>
  );
}

function Page({commentsPromise}: any) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  );
}

function Comments({commentsPromise}: any) {
  // use 在渲染中读取资源
  // use 读取一个promise，React将挂起，直到promise解析完成
  const comments = use<any>(Promise.all(commentsPromise));
  // console.log("🚀 ~ Comments ~ comments:", comments)
  return (
    <ul>
      {comments.map((comment: {id: number; text: string}) => (
        <li key={comment.id}>{comment.text}</li>
      ))}
    </ul>
  );
}

function MyInput({placeholder, ref, handleFocus}: any) {
  // ref可以作为一个属性进行传递
  return <input placeholder={placeholder} ref={ref} onFocus={handleFocus} />;
}

const Search = function () {
  const [query, setQuery] = useState('');
  return (
    <div>
      <label>
        search albums:
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
};

const SearchResults = ({query}: any) => {
  console.log(query, 'query---');
  if (query === '') {
    return null;
  }
  const albums = use(getData);
  // console.log('🚀 ~ SearchResults ~ albums:', albums.items);

  if (albums.items.length === 0) {
    return <div>No results</div>;
  }
  return (
    <ul>
      {albums.items.map((item: any) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
};
export default React19;
