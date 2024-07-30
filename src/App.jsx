import React, { useEffect, useRef, useState } from 'react'
import { Button, Col, Input, Row } from 'reactstrap';
import axios from 'axios'

//Getting server URL
const SERVER_URL = 'http://localhost:8000';

const App = () => {
  const [value, setValue] = useState('');
  const [tasks, setTasks] = useState([]);
  const updateRef = useRef({ status: false, id: null });

  //Function to get data
  async function fetchData() {
    try {
      const res = await axios.get(SERVER_URL + '/view');
      setTasks(res.data);
    } catch (error) {
      console.log('While loading Error:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  //Function to add or update data
  async function add_updateTask() {
    try {
      let res;
      !updateRef.current.status ?
        //Add data
        value !== '' ? (
          await axios.post(SERVER_URL + '/add', { task: value })
            .then(res => (fetchData(), setValue('')))
            .catch(e => alert(e.response.data.message))) : alert('Enter task') :
        //update data
        (res = await axios.put(SERVER_URL + '/task/' + updateRef.current.id, { task: value }),
          (res.status) === 201 ? (fetchData(), setValue(''), updateRef.current = { status: false, id: null }) :
            console.log('error', error)
        );
    } catch (error) {
      console.log(error);
    }
  }

  //Function to show value in input and initiate update
  const update = (i, id) => {
    setValue(tasks[i].task);
    updateRef.current = { status: true, id: id };
  }

  //Function to delete task
  const remove = async (id) => {
    try {
      const res = await axios.delete(SERVER_URL + '/task/' + id)
      if (res.status === 200) fetchData();
      else console.log("Error while deleting");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='m-3 px-2 text-center'>
      <h3 className='m-auto text-secondary'>ToDo App</h3>
      <Row className='m-auto px-3 g-2 justify-content-md-center'>
        <Col sm={8}>
          <Input placeholder='Todo' onChange={(e) => setValue(e.target.value)} value={value} />
        </Col>
        <Col sm={2}>
          <Button onClick={() => add_updateTask()} outline color='success'>{updateRef.current.status ? 'Update' : 'Add'}</Button>
        </Col>
      </Row>
      <Row className='mt-3 px-3 g-2 justify-content-md-center'>
        {tasks.length ? tasks.map((task, index) => (
          <Col sm={10} key={index} className='bg-info d-flex justify-content-between rounded align-items-center'>
            <div className='text-center ms-2 p-2'><p className='pt-3'>{index + 1}. {task.task}</p></div>
            <div className='pe-2'>
              <Button onClick={() => update(index, task._id)} color='warning' className=' mx-2 mb-1'>Edit</Button>
              <Button onClick={() => remove(task._id)} color='danger' >Delete</Button>
            </div>
          </Col>
        )) : null}
      </Row>
    </div>
  )
}

export default App
