import React, { useState, useRef, useEffect } from 'react';
import {
  Text,
  ScrollView,
  View,
  TextInput,
  Button,
  Image,
  ToastAndroid,
} from 'react-native';
import PieSocket from 'piesocket-js';
import 'react-native-get-random-values';
import { CLUSTER_ID, API_KEY, ROOM_ID } from '@env';
import { sendData } from '../services/pieSocketService';
import { styles } from '../styles/scoreboardControllerStyles';
import BackgroundTimer from 'react-native-background-timer';

const ScoreboardController = () => {
  const [localTeam, setLocalTeam] = useState('');
  const [visitorTeam, setVisitorTeam] = useState('');
  const [localScore, setLocalScore] = useState(0);
  const [labelLocalScore, setLabelLocalScore] = useState('Marcador local');
  const [labelVisitorScore, setLabelVisitorScore] =
    useState('Marcador visitante');
  const [visitorScore, setVisitorScore] = useState(0);
  const [period, setPeriod] = useState(1);
  const [timer, setTimer] = useState(0);
  const [newTime, setNewTime] = useState(0);
  const [runTimer, setRunTimer] = useState(0);
  const timerRef = useRef(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!wsRef.current) {
      wsRef.current = new PieSocket({
        clusterId: CLUSTER_ID,
        apiKey: API_KEY,
        notifySelf: false,
      });
    }
  }, []);

  const getActualInfo = (newTimer) => {
    return {
      localTeam : localTeam,
      visitorTeam : visitorTeam,
      localScore : localScore,
      visitorScore : visitorScore,
      period : period,
      timer : newTimer
    }
  }

  const handleStart = () => {
    if (runTimer === 0) {
      timerRef.current = BackgroundTimer.setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
      setRunTimer(1);
      sendData({ action: 'start', value: timer }, wsRef, getActualInfo(timer));
      ToastAndroid.show(
        'Tiempo iniciado satisfactoriamente',
        ToastAndroid.SHORT
      );
    }
  };

  const updateTeams = () => {
    setLabelLocalScore('Marcador ' + localTeam.toUpperCase());
    setLabelVisitorScore('Marcador ' + visitorTeam.toUpperCase());
    sendData({
      action: 'updateTeams',
      value: { visitorTeam: visitorTeam, localTeam: localTeam },
    }, wsRef, getActualInfo(timer));
    ToastAndroid.show(
      'Equipos actualizados satisfactoriamente',
      ToastAndroid.SHORT
    );
  };

  const handleStop = () => {
    if (runTimer === 1) {
      if (timerRef.current) {
        BackgroundTimer.clearInterval(timerRef.current);
      }
      setRunTimer(0);
      sendData({ action: 'stop', value: timer }, wsRef, getActualInfo(timer));
      ToastAndroid.show(
        'Tiempo detenido satisfactoriamente',
        ToastAndroid.SHORT
      );
    }
  };

  const handleResetTime = () => {
    if (runTimer === 1 || timer > 0) {
      setTimer(0);
      BackgroundTimer.clearInterval(timerRef.current);
      setRunTimer(0);
      sendData({ action: 'reset', value: 0 }, wsRef, getActualInfo(timer));
      ToastAndroid.show(
        'Tiempo reiniciado satisfactoriamente',
        ToastAndroid.SHORT
      );
    }
  };

  const handleReset = () => {
    setTimer(0);
    setLocalScore(0);
    setVisitorScore(0);
    setPeriod(1);
    BackgroundTimer.clearInterval(timerRef.current);
    setRunTimer(0);
    sendData({ action: 'sync-stop-timer' }, wsRef, getActualInfo(timer));
    ToastAndroid.show('Todo reiniciado satisfactoriamente', ToastAndroid.SHORT);
  };

  const handleSyncUp = () => {
    if (runTimer === 1) {
      sendData({ action: 'sync-run-timer' }, wsRef, getActualInfo(timer));
    } else {
      sendData({ action: 'sync-stop-timer' }, wsRef, getActualInfo(timer));
    }
    ToastAndroid.show(
      'Sincronización realizada satisfactoriamente',
      ToastAndroid.SHORT
    );
  };

  const goalLocalTeam = () => {
    setLocalScore(localScore + 1);
    sendData({ action: 'localScore', value: localScore + 1 }, wsRef, getActualInfo(timer));
  };

  const minusGoalLocalTeam = () => {
    setLocalScore(localScore - 1);
    sendData({ action: 'localScore', value: localScore - 1 }, wsRef, getActualInfo(timer));
  };

  const goalVisitorTeam = () => {
    setVisitorScore(visitorScore + 1);
    sendData({ action: 'visitorScore', value: visitorScore + 1 }, wsRef, getActualInfo(timer));
  };

  const minusGoalVisitorTeam = () => {
    setVisitorScore(visitorScore - 1);
    sendData({ action: 'visitorScore', value: visitorScore - 1 }, wsRef, getActualInfo(timer));
  };

  const upPeriod = () => {
    setPeriod(period + 1);
    sendData({ action: 'period', value: period + 1 }, wsRef, getActualInfo(timer));
  };

  const downPeriod = () => {
    setPeriod(period - 1);
    sendData({ action: 'period', value: period - 1 }, wsRef, getActualInfo(timer));
  };

  const setTime = () => {
    setTimer(newTime * 60);
    if (runTimer === 1) {
      sendData({ action: 'sync-run-timer' }, wsRef, getActualInfo(newTime * 60));
    } else {
      sendData({ action: 'sync-stop-timer' }, wsRef, getActualInfo(newTime * 60));
    }
    ToastAndroid.show(
      'Timepo establecido satisfactoriamente',
      ToastAndroid.SHORT
    );
  };

  const handleDisconnect = () => {
    if (wsRef.current) {
      wsRef.current.unsubscribe(ROOM_ID);
      ToastAndroid.show('Desconectado satisfactoriamente', ToastAndroid.SHORT);
    }
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image
          style={styles.tinyLogo}
          source={{
            uri: 'https://scontent.fppn2-1.fna.fbcdn.net/v/t39.30808-6/429830428_871908344944305_1537082886353961144_n.png?_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gZTFw7J_au0Q7kNvgHxvELE&_nc_ht=scontent.fppn2-1.fna&oh=00_AfCKdBYqH7EIp0ZgYlJekufDLTz-JWsFql21Y_THnVI8AA&oe=66336F87',
          }}
        />
        <View style={styles.divider}></View>
        <Text>Equipo local:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            setLocalTeam(text);
          }}
          value={localTeam}
        />
        <Text>Equipo Visitante:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => {
            setVisitorTeam(text);
          }}
          value={visitorTeam}
        />
        <Button
          color="green"
          title="Actualizar equipos"
          onPress={() => updateTeams()}
        />
        <View style={styles.divider}></View>
        <Text>{labelLocalScore}</Text>
        <View style={styles.fixToText}>
          <Button
            color="#de4f2f"
            title="          - 1          "
            onPress={minusGoalLocalTeam}
          />
          <Text style={styles.text}>{localScore.toString()}</Text>
          <Button
            color="#0da114"
            title="          + 1          "
            onPress={goalLocalTeam}
          />
        </View>
        <View style={styles.divider}></View>
        <Text>{labelVisitorScore}</Text>
        <View style={styles.fixToText}>
          <Button
            color="#de4f2f"
            title="          - 1          "
            onPress={minusGoalVisitorTeam}
          />
          <Text style={styles.text}>{visitorScore.toString()}</Text>
          <Button
            color="#0da114"
            title="          + 1          "
            onPress={goalVisitorTeam}
          />
        </View>
        <View style={styles.divider}></View>
        <Text>Periodo:</Text>
        <View style={styles.fixToText}>
          <Button
            color="#de4f2f"
            title="          - 1          "
            onPress={downPeriod}
          />
          <Text style={styles.text}>{period.toString()}</Text>
          <Button
            color="#0da114"
            title="          + 1          "
            onPress={upPeriod}
          />
        </View>
        <View style={styles.divider}></View>

        <Text style={styles.text}>Tiempo de juego: {formatTime(timer)}</Text>

        <View style={styles.divider}></View>
        <TextInput
        onChangeText={setNewTime}
        value={newTime}
        placeholder="Establece tiempo en minutos"
        keyboardType="numeric"
        />
        <Button title="Establecer tiempo" onPress={setTime} />
        <View style={styles.divider}></View>
        <Button color="green" title="Iniciar tiempo" onPress={handleStart} />
        <View style={styles.divider}></View>
        <Button color="#bab104" title="Parar tiempo" onPress={handleStop} />
        <View style={styles.divider}></View>
        <Button title="Reiniciar tiempo" onPress={handleResetTime} />
        <View style={styles.divider}></View>
        <Button color="#de4f2f" title="Reiniciar todo" onPress={handleReset} />
        <View style={styles.divider}></View>
        <Button color="#f79205" title="Sincronizar" onPress={handleSyncUp} />
        <View style={styles.divider}></View>
        <Button
          color="#ff0000"
          title="Desconectar"
          onPress={handleDisconnect}
        />
      </ScrollView>
    </View>
  );
};

export default ScoreboardController;
