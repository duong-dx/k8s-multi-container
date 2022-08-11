import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  
  const [dataState, setDataState] = useState({
     seenIndexes: [],
     values: {},
     index: ''
  });

  const fetchValues = async () => {
    const values1 = await axios.get('/api/values/current');
    const values2 = await axios.get('/api/values/all');

    setDataState({
      ...dataState,
      values: values1.data ?? {},
      seenIndexes: values2.data ?? []
    })
  }

  const onChange = (event) => {
    event.preventDefault(); 

    setDataState({...dataState, index: event.target.value})
  }

  const renderSeenIndexes = () => {
    return dataState.seenIndexes && dataState.seenIndexes.map((index) => index.number).join(', ');
  }

  const renderValues = () => {
    return dataState.values && Object.keys(dataState.values).map(( index) =>
        <div key={index}>
          for index {index} calculated {dataState.values[index]}
        </div>
    );
  }

  const handleSubmit = async () => {
    await axios.post('/api/values', {
      index: dataState.index
    });

    setDataState({
      ...dataState,
      index: ''
    })
  }

  useEffect(() => {
    fetchValues();
  }, []);

  return (
    <div className="App">
      <h3>App client version2</h3>
      <input placeholder='enter your index' value={dataState.index} onChange={onChange}/>
      <button onClick={handleSubmit}>Submit</button>

      <h3>Indexs i have seeen: </h3>
      {renderSeenIndexes()}

      <h3>calculate value:</h3>
      {renderValues()}
    </div>
  );
}

export default App;
