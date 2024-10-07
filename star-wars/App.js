import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Audio } from 'expo-av';

const Stack = createStackNavigator();

const personagens = [
  { name: 'Luke Skywalker', id: 1 },
  { name: 'Darth Vader', id: 4 },
  { name: 'Obi-Wan Kenobi', id: 10 },
  { name: 'Leia Organa', id: 5 },
  { name: 'R2-D2', id: 3 },
];

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personagens de Star Wars</Text>
      <FlatList
        data={personagens}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Detalhes', { id: item.id })}>
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
      />
      <Text>ATITUS</Text>
    </View>
  );
}

function DetalhesScreen({ route, navigation }) {
  const { id } = route.params;
  const [detalhes, setDetalhes] = useState(null);
  const [veiculos, setVeiculos] = useState([]);
  const [filmes, setFilmes] = useState([]);

  const som = async () => {
    const { sound } = await Audio.Sound.createAsync(require('./assets/lightsaber-sound.mp3'));
    await sound.playAsync();
  };

  useEffect(() => {
    const fetchDetails = async () => {
      const response = await axios.get(`https://swapi.dev/api/people/${id}/`);
      setDetalhes(response.data);

      const veiculoPromises = response.data.vehicles.map(url => axios.get(url));
      const veiculoResponses = await Promise.all(veiculoPromises);
      setVeiculos(veiculoResponses.map(res => res.data));

      const filmPromises = response.data.films.map(url => axios.get(url));
      const filmResponses = await Promise.all(filmPromises);
      setFilmes(filmResponses.map(res => res.data));
    };

    fetchDetails();
  }, [id]);

  if (!detalhes) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{detalhes.name}</Text>
      <Text>Altura: {detalhes.height}</Text>
      <Text>Peso: {detalhes.mass}</Text>
      <Text>Cor do cabelo: {detalhes.hair_color}</Text>
      <Text>Cor da pele: {detalhes.skin_color}</Text>
      <Text>Cor dos olhos: {detalhes.eye_color}</Text>
      <Text>Gênero: {detalhes.gender}</Text>
      <Button 
        title="Veículos" 
        onPress={async () => { 
          await som(); 
          navigation.navigate('Veiculos', { veiculos }); 
        }} 
      />
      <Button 
        title="Filmes" 
        onPress={async () => { 
          await som(); 
          navigation.navigate('Filmes', { filmes }); 
        }} 
      />
      <Text>ATITUS</Text>
    </View>
  );
}

function VeiculosScreen({ route }) {
  const { veiculos } = route.params;

  if (veiculos.length === 0) {
    return <Text>Não há veículos disponíveis.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Veículos</Text>
      <FlatList
        data={veiculos}
        renderItem={({ item, index }) => (
          <Text key={index}>
            {"\n"}Nome: {item.name}{"\n"}Modelo: {item.model}{"\n"}Passageiros: {item.passengers}
          </Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Text>ATITUS</Text>
    </View>
  );
}

function FilmesScreen({ route }) {
  const { filmes } = route.params;

  if (filmes.length === 0) {
    return <Text>Não há filmes disponíveis.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filmes</Text>
      <FlatList
        data={filmes}
        renderItem={({ item, index }) => (
          <Text key={index}>
            {"\n"}Título: {item.title}{"\n"}Diretor: {item.director}{"\n"}Data de Lançamento: {item.release_date}
          </Text>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <Text>ATITUS</Text>
    </View>
  );
}

function SobreScreen() {
  return (
    <View style={styles.container}>
    <Text style={styles.title}>Sobre o Desenvolvedor</Text>
    <Text>RA: 1129494</Text>
    <Text>Nome: Pedro Henrique De Bortoli</Text>
    <Text>E-mail: 1129494@atitus.edu.br</Text>
    <Text style={styles.spacedText}></Text><Text>RA: 1134141</Text>
    <Text>Nome: Bruno Pasquetti</Text>
    <Text>E-mail: 1134141@atitus.edu.br</Text>
    <Text>Faculdade: ATITUS Educação</Text>
  </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={({ navigation }) => ({
            headerRight: () => (
              <Button
                title="Sobre"
                onPress={() => navigation.navigate('Sobre')}
              />
            ),
          })}
        />
        <Stack.Screen name="Detalhes" component={DetalhesScreen} />
        <Stack.Screen name="Veiculos" component={VeiculosScreen} />
        <Stack.Screen name="Filmes" component={FilmesScreen} />
        <Stack.Screen name="Sobre" component={SobreScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 18,
  },
});
