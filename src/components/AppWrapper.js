import Cookies from "universal-cookie";

const cookies = new Cookies();

export const AppWrapper = ({ children, isAuth, setIsAuth, setIsInChat,  }) => {
  const signUserOut = async () => {
    cookies.remove("auth-token");
    cookies.remove("user")
    setIsAuth(false);
    setIsInChat(false);
  };

  return (
    <div className="App">
      <div className="app-header">
        <h1>ბაასი</h1>

        <nav className="navigation" >
          <ul>
            <li><button> chat </button></li>
            <li><button> photos </button></li>
          </ul>
        </nav>
      {isAuth && (
        <div className="sign-out">
          <button onClick={signUserOut}>სისტემიდან გასვლა</button>
        </div>
      )}
      </div>

      <div className="app-container">{children}</div>
    </div>
  );
};
