import {Offer} from '../../contracts/contaracts.ts';
import {convertRatingToPercent} from '../../utils/converters.ts';
import {Link, useNavigate} from 'react-router-dom';
import {APP_ROUTES, AUTHORIZATION_STATUS, CardTypeValues, FAVORITE_STATUS} from '../../constants/constants.ts';
import {useActionCreators, useAppSelector} from '../../hooks/store.ts';
import {offersActions} from '../../store/slices/offers.ts';
import {store} from '../../store/store.ts';
import {changeFavoriteStatus} from '../../store/slices/favorites.ts';
import clsx from 'clsx';

type CardType = 'City' | 'Near-Places' | 'Favorites'

type SelectHandler = {onSelect: (id: string | null) => void}

interface CardPropsType {
  cardType: CardType;
}

type CardProps = Pick<Offer,
  'isPremium'
| 'isFavorite'
| 'previewImage'
| 'id'
| 'title'
| 'price'
| 'rating'
| 'type'> & SelectHandler & CardPropsType

export const Card = (props: CardProps) => {
  const typeValues = CardTypeValues.get(props.cardType);
  const {removeSelectedOffer} = useActionCreators(offersActions);
  const auth = useAppSelector((state) => state.authentication.status);
  const navigate = useNavigate();
  const handleMouseEnter = () => {
    props.onSelect(props.id);
  };
  const handleMouseLeave = () => {
    if (props.cardType === 'City') {
      removeSelectedOffer();
    }
    props.onSelect(null);
  };

  const handleBookmarkButton = () => {
    const statusToChange = (props.isFavorite) ? FAVORITE_STATUS.NOT_FAVORITE : FAVORITE_STATUS.FAVORITE;
    if(auth === AUTHORIZATION_STATUS.AUTHORIZED) {
      store.dispatch(changeFavoriteStatus({offerId: props.id, status: statusToChange}));
    } else {
      navigate(APP_ROUTES.LOGIN);
    }
  };

  return (
    <article className={`${typeValues!.articleClass} place-card`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {props.isPremium ? <div className="place-card__mark"><span>Premium</span></div> : ''}
      <div className={`${typeValues!.imageClass} place-card__image-wrapper`}>
        <Link to={`/offer/${props.id}`}>
          <img
            className="place-card__image"
            src={props.previewImage}
            width={typeValues!.width}
            height={typeValues!.height}
            alt={props.title}
          />
        </Link>
      </div>
      <div className={`${typeValues!.cardInfo} place-card__info`}>
        <div className="place-card__price-wrapper">
          <div className="place-card__price">
            <b className="place-card__price-value">€{props.price}</b>
            <span className="place-card__price-text">/&nbsp; night</span>
          </div>
          <button
            className={clsx('place-card__bookmark-button', 'button' , {'place-card__bookmark-button--active': props.isFavorite})}
            type="button"
            onClick={handleBookmarkButton}
          >
            <svg className="place-card__bookmark-icon" width={18} height={19}>
              <use xlinkHref="#icon-bookmark"/>
            </svg>
            <span className="visually-hidden">In bookmarks</span>
          </button>
        </div>
        <div className="place-card__rating rating">
          <div className="place-card__stars rating__stars">
            <span style={{width: `${convertRatingToPercent(props.rating)}%`}}/>
            <span className="visually-hidden">Rating</span>
          </div>
        </div>
        <h2 className="place-card__name">
          <Link to={`/offer/${props.id.toString()}`}>{props.title}</Link>
        </h2>
        <p className="place-card__type">{props.type}</p>
      </div>
    </article>
  );
};
