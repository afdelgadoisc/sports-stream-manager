import { ROOM_ID } from '@env';

export const sendData = (data, wsRef, actualInfo) => {
  info = {};
  if (data.action === "updateTeams") {
    actualInfo.localTeam = data.value.localTeam;
    actualInfo.visitorTeam = data.value.visitorTeam;
  }
  if (data.action === "localScore") {
    actualInfo.localScore = data.value;
  }
  if (data.action === "visitorScore") {
    actualInfo.visitorScore = data.value;
  }
  if (data.action === "period") {
    actualInfo.period = data.value;
  }
  if (
    data.action === "start" ||
    data.action === "stop" ||
    data.action === "reset"
  ) {
    actualInfo.timer = data.value;
  }
  info = {
    teamAName: actualInfo.localTeam,
    teamBName: actualInfo.visitorTeam,
    teamAScore: actualInfo.localScore,
    teamBScore: actualInfo.visitorScore,
    period: actualInfo.period,
    time: actualInfo.timer,
  };

  if (wsRef.current) {
    wsRef.current.subscribe(ROOM_ID).then((channel) => {
      channel.publish(data.action, info);
    });
  }
};
