/* eslint-disable no-undef */
import './App.css'
import { useState, useRef, useEffect } from 'react';
import logo from './assets/logo.svg'
import Team from './components/Team'
import Timer from './components/Timer'
import Score from './components/Score'
import PieSocket from 'piesocket-js';

function App() {
  const [localTeam, setLocalTeam] = useState('');
  const [visitorTeam, setVisitorTeam] = useState('');
  const [localScore, setLocalScore] = useState(0);
  const [visitorScore, setVisitorScore] = useState(0);
  const [period, setPeriod] = useState(1);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = new PieSocket({
        clusterId: process.env.CLUSTER_ID,
        apiKey: process.env.API_KEY,
        notifySelf: false,
      });

      wsRef.current.subscribe(process.env.ROOM_ID).then((channel) => {
        console.log("Channel is ready");

        channel.listen("updateTeams", (data) => {
          setLocalTeam(data.teamAName);
          setVisitorTeam(data.teamBName);
        });

        channel.listen("localScore", (data) => {
          setLocalScore(data.teamAScore);
        });

        channel.listen("visitorScore", (data) => {
          setVisitorScore(data.teamBScore);
        });

        channel.listen("period", (data) => {
          setPeriod(data.period);
        });

        channel.listen("start", (data) => {
          setTimer(data.time);
          timerRef.current = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
          }, 1000);
        });

        channel.listen("stop", (data) => {
          setTimer(data.time);
          if (timerRef.current > 0) {
            clearInterval(timerRef.current);
          }
        });

        channel.listen("reset", (data) => {
          setTimer(data.time);
          clearInterval(timerRef.current);
        });

        channel.listen("sync-run-timer", (data) => {
          setLocalTeam(data.teamAName);
          setVisitorTeam(data.teamBName);
          setLocalScore(data.teamAScore);
          setVisitorScore(data.teamBScore);
          setPeriod(data.period);
          setTimer(data.time);
          if (timerRef.current === 0) {
            timerRef.current = setInterval(() => {
              setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
          }
        });

        channel.listen("sync-stop-timer", (data) => {
          setLocalTeam(data.teamAName);
          setVisitorTeam(data.teamBName);
          setLocalScore(data.teamAScore);
          setVisitorScore(data.teamBScore);
          setPeriod(data.period);
          setTimer(data.time);
          clearInterval(timerRef.current);

        });
      });
    }
  }, []);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <section>
      <div className="container">
        <div className="logo">
          <img src={logo} alt="logo deportivo news" />
        </div>
        <Team name={localTeam} isHome={true} />
        <Score value={localScore} isHome={true} />
        <div className="box space">-</div>
        <Score value={visitorScore} isHome={false} />
        <Team name={visitorTeam} isHome={false} />
        <Timer time={formatTime(timer)} period={period} />
      </div>
    </section>
  )
}

export default App
