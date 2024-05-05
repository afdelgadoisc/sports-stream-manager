import { useEffect, useState, useRef  } from 'react';
import PropTypes from 'prop-types';

const Score = ({value, isHome}) => {
  const [goalAnimation, setGoalAnimation] = useState(false);
  const [showGoalText, setShowGoalText] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const prevValue = prevValueRef.current;
    if (value > prevValue) {
      setGoalAnimation(true);
      setShowGoalText(true);
      setTimeout(() => {
        setGoalAnimation(false);
        setShowGoalText(false);
      }, 3000);
    }
    prevValueRef.current = value;
  }, [value]);

  const boxPointsClassName = `box boxpoints ${isHome ? 'boxhomepoints' : 'boxawaypoints'} ${goalAnimation ? 'goal-scored' : ''}`;
  const classNameGoalText = `gool-text-${isHome ? 'home' : 'away'}`;
  const gooolStyle = {
    left: isHome ? '10%' : '90%',
  };
  const idScore = isHome ? 'points_home' : 'points_away';
  return (
    <>
      <div className={boxPointsClassName} id={idScore}>{value}</div>
      {showGoalText && <div className={classNameGoalText} style={gooolStyle}>GOOOOL!!</div>}
    </>
  );
};

Score.propTypes = {
  value: PropTypes.number.isRequired,
  isHome: PropTypes.bool.isRequired
};

export default Score;
