import React from 'react';
import dog from './dog.jpg';
import './App.css';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import * as queries from './graphql/queries';
import * as mutations from './graphql/mutations';
import '@aws-amplify/ui/dist/style.css';
Auth.configure(awsconfig);
API.configure(awsconfig);

function updateTodo(todo, newDesc){
  todo['description'] = newDesc;
  API.graphql(graphqlOperation(mutations.updateTodo, {input: todo}));
}

function deleteTodo(todo) {
  API.graphql(graphqlOperation(mutations.deleteTodo, {input: {'id': todo['id']}}));
}

function App() {

  const userTodos = API.graphql(graphqlOperation(queries.listTodos, {filter: {'name':{'eq':"name" }}}));
  console.log(userTodos);

  const allTodos = API.graphql(graphqlOperation(queries.listTodos));
  console.log(allTodos);

  const oneTodo = API.graphql(graphqlOperation(queries.getTodo, { id: "943d98d5-8273-48ec-9f12-5878688cfb47"})).then(function(todo) {
    updateTodo(todo['data']['getTodo'], "new description");
    deleteTodo(todo['data']['getTodo']);
  });
  console.log(oneTodo);

  Auth.currentAuthenticatedUser({
    bypassCache: false
  }).then(function(user) {
    console.log("User: " + JSON.stringify(user));
    const todo = { name: user['username'], description: "new todo" };
    const newTodo = API.graphql(graphqlOperation(mutations.createTodo, { input: todo }));
}).catch(err => console.log(err));

  return (
    <div className="App">
      <header className="App-header">
        <img src={dog} className="My Dog" alt="logo" width="300" height="300" />
        
      </header>
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
//export default App;
