import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';

import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';

type Project = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
};

type Resume = {
  name: string;
  email: string;
  phone: string;
  address: string;
  twitter: string;
  summary: string;
  skills: string[];
  projects: Project[];
};

const ResumeApp = () => {
  const [name, setName] = useState('NAME');
  const [isEditingName, setIsEditingName] = useState(false);
  const [resumeData, setResumeData] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('System');
  const [bgColor, setBgColor] = useState('white');
  const [bodyTextColor, setBodyTextColor] = useState('black');

  const baseTextStyle = {
    fontSize,
    fontFamily,
    color: bodyTextColor,
  };

  const fetchResume = () => {
    setLoading(true);
    fetch(`https://expressjs-api-resume-random.onrender.com/resume?name=${name}`)
      .then(res => res.json())
      .then(data => {
        setResumeData(data);
        setLoading(false);
        setIsEditingName(false);
      })
      .catch(err => {
        console.error(err);
        setResumeData(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchResume();
    setRefreshing(false);
  };

  const renderResume = () => {
    if (!resumeData) return null;

    return (
      <View>
        <Text style={[{ fontWeight: 'bold', fontSize: fontSize + 3, color: 'black' }, baseTextStyle, { marginBottom: 6 }]}>
          {resumeData.name}
        </Text>
        <Text style={[baseTextStyle, { marginBottom: 4 }]}>Email: {resumeData.email}</Text>
        <Text style={[baseTextStyle, { marginBottom: 4 }]}>Phone: {resumeData.phone}</Text>
        <Text style={[baseTextStyle, { marginBottom: 4 }]}>Address: {resumeData.address}</Text>
        <Text style={[baseTextStyle, { marginBottom: 8 }]}>Twitter: {resumeData.twitter}</Text>

        <Text style={[{ fontSize: fontSize + 3, fontWeight: 'bold', color: 'black' }, baseTextStyle, { marginTop: 10 }]}>
          Profile
        </Text>
        <Text style={[baseTextStyle, { marginBottom: 10 }]}>{resumeData.summary}</Text>

        <Text style={[{ fontSize: fontSize + 3, fontWeight: 'bold', color: 'black' }, baseTextStyle, { marginTop: 10 }]}>
          Skills:
        </Text>
        {resumeData.skills.map((skill, idx) => (
          <Text key={idx} style={baseTextStyle}>
            • {skill}
          </Text>
        ))}

        <Text style={[{ fontSize: fontSize + 3, fontWeight: 'bold', color: 'black' }, baseTextStyle, { marginTop: 10 }]}>
          Projects:
        </Text>
        {resumeData.projects.map((proj, idx) => (
          <View key={idx} style={{ marginBottom: 10 }}>
            <Text style={[{ fontWeight: 'bold', color: 'black' }, baseTextStyle]}>{proj.title}</Text>
            <Text style={baseTextStyle}>{proj.description}</Text>
            <Text style={[baseTextStyle, { fontSize: 12, color: 'gray' }]}>
              {proj.startDate} - {proj.endDate}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        backgroundColor: 'white', // outer background always white
      }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Name input / edit */}
      {isEditingName ? (
        <View style={{ marginBottom: 20 }}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
            style={{ borderBottomWidth: 1, fontSize: 18 }}
          />
          <Button title="Generate Resume" onPress={fetchResume} />
        </View>
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold' }}>{name}</Text>
          <Button title="⟳" onPress={() => setIsEditingName(true)} />
        </View>
      )}

      {/* Font size */}
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Font Size: {fontSize}</Text>
      <Slider
        minimumValue={12}
        maximumValue={24}
        value={fontSize}
        onValueChange={value => setFontSize(Math.round(value))}
        style={{ marginBottom: 20 }}
      />

      {/* Background color picker */}
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>Background Color</Text>
      <Picker selectedValue={bgColor} onValueChange={value => setBgColor(value)} style={{ marginBottom: 20 }}>
        <Picker.Item label="White" value="white" />
        <Picker.Item label="Light Gray" value="#f0f0f0" />
        <Picker.Item label="Beige" value="#fdf5e6" />
        <Picker.Item label="Light Red" value="#FF7F7F" />
      </Picker>

      {/* Font family */}
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>Font Family</Text>
      <Picker selectedValue={fontFamily} onValueChange={value => setFontFamily(value)} style={{ marginBottom: 20 }}>
        <Picker.Item label="Default" value="System" />
        <Picker.Item label="Serif" value="serif" />
        <Picker.Item label="Monospace" value="monospace" />
      </Picker>

      {/* Body font color */}
      <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>Body Font Color</Text>
      <Picker selectedValue={bodyTextColor} onValueChange={value => setBodyTextColor(value)} style={{ marginBottom: 20 }}>
        <Picker.Item label="Black" value="black" />
        <Picker.Item label="Dark Gray" value="#333333" />
        <Picker.Item label="Blue" value="blue" />
        <Picker.Item label="Dark Red" value="#8B0000" />
        <Picker.Item label="Teal" value="teal" />
      </Picker>

      {/* Resume Display */}
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={{ backgroundColor: bgColor, padding: 20, borderRadius: 10 }}>
          {renderResume()}
        </View>
      )}
    </ScrollView>
  );
};

export default ResumeApp;
