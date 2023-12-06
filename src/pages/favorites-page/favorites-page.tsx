import React from 'react';
import {useDocumentTitle} from '../../hooks/useDocumentTitle.ts';
import {Offer} from '../../contracts/contaracts.ts';
import {Card} from '../../components/card/card.tsx';
import {useAppSelector} from '../../hooks/store.ts';
import {store} from '../../store/store.ts';
import {fetchOffer} from '../../store/slices/offers.ts';
import {EmptyFavorites} from '../../components/empty/empty-favorites.tsx';
import {NavLink} from 'react-router-dom';

type GroupedOffers = {[k:string]: Offer[]}


const FavoritesPage = () => {
  useDocumentTitle('Favorites');
  const offers = useAppSelector((state) => state.favorites.favorites);
  const groupedOffers = Array.from(Object.entries(offers.reduce((array: GroupedOffers , current: Offer) => {
    (array[current.city['name']] = array[current.city['name']] || []).push(current);
    return array;
  }, {})));
  const selectedCard = useAppSelector((state) => state.offers.selectedOffer);
  const handleSelectedCard = (id: string | null) => {
    if (selectedCard !== id && id !== null){
      store.dispatch(fetchOffer(id));
    }
  };

  return (
    <React.Fragment>
      {(offers.length === 0) ? <EmptyFavorites /> : (
        <main className="page__main page__main--favorites">
          <div className="page__favorites-container container">
            <section className="favorites">
              <h1 className="favorites__title">Saved listing</h1>
              <ul className="favorites__list">
                {groupedOffers.map((group: [string,Offer[]]) => (
                  <li className="favorites__locations-items" key={group[0]}>
                    <div className="favorites__locations locations locations--current">
                      <div className="locations__item">
                        <NavLink className="locations__item-link" to={`/${group[0]}`}>
                          <span>{group[0]}</span>
                        </NavLink>
                      </div>
                    </div>
                    <div className="favorites__places">
                      {group[1].map((offer) => (
                        <Card key={offer.id}
                          cardType={'Favorites'}
                          {...offer}
                          onSelect={handleSelectedCard}
                        />))}
                    </div>
                  </li>))}
              </ul>
            </section>
          </div>
        </main>
      )}
      <footer className="footer container">
        <NavLink className="footer__logo-link" to={'/'}>
          <img
            className="footer__logo"
            src="img/logo.svg"
            alt="6 cities logo"
            width={64}
            height={33}
          />
        </NavLink>
      </footer>
    </React.Fragment>
  );
};

export {FavoritesPage};

