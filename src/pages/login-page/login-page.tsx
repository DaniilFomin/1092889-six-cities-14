import {useDocumentTitle} from '../../hooks/useDocumentTitle.ts';
import {store} from '../../store/store.ts';
import {login} from '../../store/slices/authentication.ts';
import {FormEvent, useState} from 'react';
import {AUTHORIZATION_STATUS, CITIES} from '../../constants/constants.ts';
import {Navigate, NavLink} from 'react-router-dom';
import {LoginCredentials} from '../../contracts/contaracts.ts';
import {useAppSelector} from '../../hooks/store.ts';


export const LoginPage = () => {
  const authStatus = useAppSelector((state) => state.authentication.status);
  const [isDisabled, setIsDisabled] = useState(false);
  const [randomCity] = useState(CITIES[Math.floor(Math.random() * CITIES.length)]);
  useDocumentTitle('Login');
  const handleLogin = (evt: FormEvent) => {
    evt.preventDefault();
    const target = evt.target as HTMLFormElement;
    const data = new FormData(target);
    const credentials = Object.fromEntries(data.entries()) as LoginCredentials;
    setIsDisabled(true);
    store.dispatch(login(credentials)).then(() => {
      setIsDisabled(false);
    }).catch(() => {
      setIsDisabled(false);
    });
  };

  return (
    <div className="page page--gray page--login">
      {(authStatus === AUTHORIZATION_STATUS.AUTHORIZED) ? <Navigate to={'/'} /> : ''}
      <header className="header">
        <div className="container">
          <div className="header__wrapper">
            <div className="header__left">
              <a className="header__logo-link" href="/">
                <img
                  className="header__logo"
                  src="img/logo.svg"
                  alt="6 cities logo"
                  width={81}
                  height={41}
                />
              </a>
            </div>
          </div>
        </div>
      </header>
      <main className="page__main page__main--login">
        <div className="page__login-container container">
          <section className="login">
            <h1 className="login__title">Sign in</h1>
            <form className="login__form form" action="#" method="post" onSubmit={handleLogin}>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">E-mail</label>
                <input
                  className="login__input form__input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  disabled={isDisabled}
                  pattern="^[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:\.[a-zA-Z0-9]+)*$"
                  required
                />
              </div>
              <div className="login__input-wrapper form__input-wrapper">
                <label className="visually-hidden">Password</label>
                <input
                  className="login__input form__input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  pattern="^(?=.*[a-zA-Z])(?=.*\d).+$"
                  disabled={isDisabled}
                  required
                />
              </div>
              <button className="login__submit form__submit button" type="submit" disabled={isDisabled}>
                Sign in
              </button>
            </form>
          </section>
          <section className="locations locations--login locations--current">
            <div className="locations__item">
              <NavLink to={`/${randomCity.name}`} className="locations__item-link" >
                <span>{randomCity.name}</span>
              </NavLink>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
