import { useState } from 'react';
import { useUser } from '../../lib/hooks';
import { Input, Icon, MonochromeIcons } from '@magiclabs/ui';

const AddTodoForm = ({ setTodoAdded, isLoading, setIsLoading }) => {
  const user = useUser();
  const [todo, setTodo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!todo) return;
    setIsLoading(true);
    await fetch(process.env.NEXT_PUBLIC_HASURA_TODO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + user?.token,
      },
      body: JSON.stringify(addTodoQuery),
    });
    setTodo('');
    setIsLoading(false);
    setTodoAdded(true);
  };

  const addTodoQuery = {
    query: `mutation {
      insert_todos_one(object: {todo: "${todo}", user_id: "${user?.issuer}"}) {
        todo
      }
    }`,
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input
          placeholder='Enter your task'
          size='lg'
          type='text'
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          prefix={<Icon inline type={MonochromeIcons.CaretRight} color={'#888'} size={26} />}
          suffix={
            isLoading && (
              <img
                height='20px'
                src={'https://media.tenor.com/images/9da8a7cec33307a43306a32e54fbaca0/tenor.gif'}
              />
            )
          }
        />
      </form>
    </>
  );
};

export default AddTodoForm;
