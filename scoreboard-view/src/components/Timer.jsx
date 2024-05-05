import PropTypes from 'prop-types';

const Timer = ({time, period}) => {
  return (
    <>
      <div className="box boxtimer" id="timer">{time}</div>
      <div className="box boxmoment" id="ovt"><span><em id="overtime">T</em><strong id="moment">{period}</strong></span></div>
    </>
  );
};

Timer.propTypes = {
  time: PropTypes.string.isRequired,
  period: PropTypes.number.isRequired
};

export default Timer;