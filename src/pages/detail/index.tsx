import {useNavigate, useParams} from 'react-router-dom';

export default function Detail() {
  const {id} = useParams();
  const navigate = useNavigate();
  const handelBack = () => {
    navigate('/');
  };
  
  return (
    <div>
      <h1>detail-{id}</h1>
      <button onClick={handelBack}>back</button>
    </div>
  );
}
