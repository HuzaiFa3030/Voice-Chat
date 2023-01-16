import {
  StyleSheet,
  Text,
  StatusBar,
  View,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MyIconBtn from './src/components/MyIconBtn';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSet,
  AudioSourceAndroidType,
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';

const Home = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');
  const [currentPositionSec, setCurrentPositionSec] = useState(0);
  const [currentDurationSec, setCurrentDurationSec] = useState(0);
  const [playTime, setPlayTime] = useState('00:00:00');
  const [duration, setDuration] = useState('00:00:00');
  const [audioRecorderPlayer, setAudioRecorderPlayer] = useState(null);
  const [MyVoiceArray, setMyVoiceArray] = useState([]);
  let count = 0;

  // let audioRecorderPlayer = new AudioRecorderPlayer();
  // audioRecorderPlayer.setSubscriptionDuration(0.09);

  useEffect(() => {
    if (audioRecorderPlayer === null) {
      let audioRecorderPlayer = new AudioRecorderPlayer();
      audioRecorderPlayer.setSubscriptionDuration(0.09);
      setAudioRecorderPlayer(audioRecorderPlayer);
    }
  }, [audioRecorderPlayer]);

  useEffect(async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external stroage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }, []);

  const onStartRecord = async () => {
    const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      ios: 'hello.m4a',
      android: `${dirs.CacheDir}/hello${count++}.mp3`,
    });
    const audioSet = {
      AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
      AudioSourceAndroid: AudioSourceAndroidType.MIC,
      AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
      AVNumberOfChannelsKeyIOS: 2,
      AVFormatIDKeyIOS: AVEncodingOption.aac,
    };
    console.log('audioSet', audioSet);
    const uri = await audioRecorderPlayer.startRecorder(path, audioSet);
    audioRecorderPlayer.addRecordBackListener(e => {
      setRecordSecs(e.current_position);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
    });
    console.log(`uri: ${uri}`);
    setMyVoiceArray(path, audioSet);
  };

  const onStopRecord = async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setRecordSecs(0);
    console.log(result);
  };

  const onStartPlay = async e => {
    console.log('onStartPlay');
    const dirs = RNFetchBlob.fs.dirs;
    const path = Platform.select({
      ios: 'hello.m4a',
      android: `${dirs.CacheDir}/hello${count}.mp3`,
    });
    const msg = await audioRecorderPlayer.startPlayer(path);
    audioRecorderPlayer.setVolume(1.0);
    console.log('msg', msg);
    audioRecorderPlayer.addPlayBackListener(e => {
      if (e.current_position === e.duration) {
        console.log('finished');
        audioRecorderPlayer.stopPlayer();
      }
      setCurrentPositionSec(e.current_position);
      setCurrentDurationSec(e.duration);
      setPlayTime(audioRecorderPlayer.mmssss(Math.floor(e.current_position)));
      setDuration(audioRecorderPlayer.mmssss(Math.floor(e.duration)));
    });
  };

  const onPausePlay = async e => {
    await audioRecorderPlayer.pausePlayer();
  };

  const onStopPlay = async e => {
    console.log('onStopPlay');
    audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
  };

  console.log('MyVoiceArray==>', MyVoiceArray);
  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor="#000" />
      <View style={styles.container}>
        <Text>{recordTime}</Text>
        <MyIconBtn
          icon="microphone"
          iconColor="#D60556"
          containerColor="#000"
          animated={true}
          size={28}
          onPress={onStartRecord}
          mode="contained"
          accessibilityLabel="Press to record relse to send"
          style={{justifyContent: 'center', alignItems: 'center'}}
        />
        <MyIconBtn
          icon="stop"
          iconColor="#D60556"
          containerColor="#000"
          animated={true}
          size={28}
          onPress={onStopRecord}
          mode="contained"
          accessibilityLabel="Press to record relse to send"
          style={{justifyContent: 'center', alignItems: 'center'}}
        />
        <Text>{playTime}</Text>
        <MyIconBtn
          icon="play"
          iconColor="#D60556"
          containerColor="#000"
          animated={true}
          size={28}
          onPress={onStartPlay}
          mode="contained"
          accessibilityLabel="Press to record relse to send"
          style={{justifyContent: 'center', alignItems: 'center'}}
        />
        <MyIconBtn
          icon="stop"
          iconColor="#D60556"
          containerColor="#000"
          animated={true}
          size={28}
          onPress={onStopPlay}
          mode="contained"
          accessibilityLabel="Press to record relse to send"
          style={{justifyContent: 'center', alignItems: 'center'}}
        />
        <MyIconBtn
          icon="pause"
          iconColor="#D60556"
          containerColor="#000"
          animated={true}
          size={28}
          onPress={onPausePlay}
          mode="contained"
          accessibilityLabel="Press to record relse to send"
          style={{justifyContent: 'center', alignItems: 'center'}}
        />
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // flexDirection: 'row',
  },
});
