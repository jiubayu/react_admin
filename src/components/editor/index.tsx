import '@/utils/highlight';
import ReactQuill, {type ReactQuillProps} from 'react-quill';
import {StyledEditor} from './styles';
import Toolbar, {formats} from './toolbar';

interface Props extends ReactQuillProps {
  sample?: boolean;
}

const toolbarOptions = {
  container: [
    [{header: [1, 2, 3, 4, 5, 6, false]}],
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],
    [{list: 'ordered'}, {list: 'bullet'}, {list: 'check'}],
    [{script: 'sub'}, {script: 'super'}], // superscript/subscript
    [{align: []}],
    [{indent: '-1'}, {indent: '+1'}], // outdent/indent
    [{direction: 'rtl'}], // text direction
    [{color: []}, {background: []}], // dropdown with defaults from theme
    // [{ font: [] }],
    ['link', 'image', 'video', 'formula'],
    ['clean'], // remove formatting button
  ],
};

export default function Editor({
  id = 'slash-quill',
  sample = false,
  ...other
}: Props) {
  const modules = {
    toolbar: toolbarOptions,
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: true,
    clipboard: {
      matchVisual: false,
    },
  };
  return (
    <StyledEditor>
      <Toolbar id={id} isSimple={sample} />
      <ReactQuill
        modules={modules}
        formats={formats}
        {...other}
        placeholder='Write something awesome...'
      />
    </StyledEditor>
  );
}
