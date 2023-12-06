import {convertRatingToPercent} from '../../utils/converters.ts';
import {ReviewForm} from '../review-form/review-form.tsx';
import {Comment} from '../../contracts/contaracts.ts';
import {formatDate, isPlural} from '../../utils/intl.ts';
import {useAppSelector} from '../../hooks/store.ts';
import {AUTHORIZATION_STATUS} from '../../constants/constants.ts';

interface ReviewsListProps {
  comments: Comment[];
}

const ReviewsList = ({comments}: ReviewsListProps) => {
  const auth = useAppSelector((state) => state.authentication.status);
  const sortedComments = comments.toSorted((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return (
    <section className="offer__reviews reviews">
      <h2 className="reviews__title">
        {isPlural(comments.length) ? 'Reviews' : 'Review'} · <span className="reviews__amount">{comments.length}</span>
      </h2>
      <ul className="reviews__list">
        {sortedComments.toReversed().slice(0,10).map((comment: Comment) => (
          <li className="reviews__item" key={comment.id}>
            <div className="reviews__user user">
              <div className="reviews__avatar-wrapper user__avatar-wrapper">
                <img
                  className="reviews__avatar user__avatar"
                  src={comment.user.avatarUrl}
                  width={54}
                  height={54}
                  alt="Reviews avatar"
                />
              </div>
              <span className="reviews__user-name">{comment.user.name}</span>
            </div>
            <div className="reviews__info">
              <div className="reviews__rating rating">
                <div className="reviews__stars rating__stars">
                  <span style={{width: `${convertRatingToPercent(comment.rating)}%`}}/>
                  <span className="visually-hidden">Rating</span>
                </div>
              </div>
              <p className="reviews__text">
                {comment.comment}
              </p>
              <time className="reviews__time" dateTime={new Date(comment.date).toLocaleString()}>
                {formatDate(new Date(comment.date))}
              </time>
            </div>
          </li>
        ))}
      </ul>
      {(auth === AUTHORIZATION_STATUS.AUTHORIZED) ? <ReviewForm/> : '' }
    </section>
  );
};

export {ReviewsList};

