// export const initialStore=()=>{
//   return{
//     message: null,
//     todos: [
//       {
//         id: 1,
//         title: "Make the bed",
//         background: null,
//       },
//       {
//         id: 2,
//         title: "Do my homework",
//         background: null,
//       }
//     ]
//   }
// }

// export default function storeReducer(store, action = {}) {
//   switch(action.type){
//     case 'set_hello':
//       return {
//         ...store,
//         message: action.payload
//       };
      
//     case 'add_task':

//       const { id,  color } = action.payload

//       return {
//         ...store,
//         todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
//       };
//     default:
//       throw Error('Unknown action.');
//   }    
// }


export const initialStore = () => {
  // Verificar si ya existe un token en sessionStorage
  const token = sessionStorage.getItem('token');
  const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

  return {
    message: null,
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ],
    auth: {
      token: token,
      user: user,
      isAuthenticated: !!token,
      error: null,
      loading: false
    }
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };

    case 'add_task':
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };

    // Auth actions
    case 'auth_loading':
      return {
        ...store,
        auth: {
          ...store.auth,
          loading: true,
          error: null
        }
      };

    case 'auth_success':
      // Guardar token y datos del usuario en sessionStorage
      sessionStorage.setItem('token', action.payload.token);
      sessionStorage.setItem('user', JSON.stringify(action.payload.user));
      
      return {
        ...store,
        auth: {
          token: action.payload.token,
          user: action.payload.user,
          isAuthenticated: true,
          error: null,
          loading: false
        }
      };

    case 'auth_error':
      return {
        ...store,
        auth: {
          ...store.auth,
          error: action.payload,
          loading: false
        }
      };

    case 'auth_logout':
      // Limpiar sessionStorage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      return {
        ...store,
        auth: {
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
          loading: false
        }
      };

    default:
      return store;
  }
}