import PropTypes from 'prop-types';

const Team = ({name, isHome}) => {
  const boxTeamClassName = isHome ? 'box boxteams boxhometeam' : 'box boxteams boxawayteam';
  return (
    <>
      <div className={boxTeamClassName} id={name.toUpperCase()}>{name.toUpperCase()}</div>
    </>
  );
};

Team.propTypes = {
  name: PropTypes.string.isRequired,
  isHome: PropTypes.bool.isRequired
};

export default Team;
