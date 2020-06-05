import React, { useEffect, useState } from "react";
import { ImageBackground, View, StyleSheet, Text, Image } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";

import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../../services/api";

interface IIbgeUfResponse {
  sigla: string;
  nome: string;
}

interface IIbgeCityResponse {
  nome: string;
}

type SelectItem = {
  label: string;
  value: string;
};

interface IParams {
  uf: string;
  city: string;
}

const Home: React.FC = () => {
  const [ufs, setUfs] = useState<SelectItem[]>([{} as SelectItem]);
  const [cities, setCities] = useState<SelectItem[]>([{} as SelectItem]);

  const [selectedUf, setSelectedUf] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  const navigation = useNavigation();

  //api ibge para siglas dos estados
  useEffect(() => {
    api
      .get<IIbgeUfResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome`
      )
      .then((response) => {
        const ufInitials = response.data.map((uf) => {
          const selectRow = { label: "", value: "" };

          selectRow.label = uf.nome;
          selectRow.value = uf.sigla;

          return selectRow;
        });
        setUfs(ufInitials);
      });
  }, []);

  //ibge municipios por estado
  useEffect(() => {
    api
      .get<IIbgeCityResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cityNames = response.data.map((city) => {
          const cityRow = { label: "", value: "" };
          cityRow.label = city.nome;
          cityRow.value = city.nome;

          return cityRow;
        });
        setCities(cityNames);
      });
  }, [selectedUf]);

  function handleNavigateToPoints() {
    navigation.navigate("Points", {
      selected_uf: selectedUf,
      selected_city: selectedCity,
    });
    setSelectedCity("");
    setSelectedUf("");
  }

  return (
    <ImageBackground
      source={require("../../assets/home-background.png")}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduoes</Text>
        <Text style={styles.description}>
          ajudamos pessoas a encontrar pontos de coleta de forma eficiente.
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.selectField}>
          <RNPickerSelect
            placeholder={{
              label: "selecione um estado",
              value: null,
              color: "#000",
            }}
            items={ufs}
            value={selectedUf && selectedUf ? selectedUf : ""}
            onValueChange={(value) => setSelectedUf(value)}
            style={{
              placeholder: {
                color: "#999",
                fontSize: 16,
                fontFamily: "Roboto_500Medium",
              },
            }}
            Icon={() => {
              return <Icon name="chevron-down" size={24} color="#999" />;
            }}
          />
        </View>
        <View style={styles.selectField}>
          <RNPickerSelect
            items={cities}
            value={selectedCity && selectedCity ? selectedCity : ""}
            onValueChange={(value) => setSelectedCity(value)}
            placeholder={{
              label: "selecione uma cidade",
              value: null,
              color: "#000",
            }}
            style={{
              placeholder: {
                color: "#999",
                fontSize: 16,
                fontFamily: "Roboto_500Medium",
              },
            }}
            Icon={() => {
              return <Icon name="chevron-down" size={24} color="#999" />;
            }}
          />
        </View>

        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#fff" size={24} />
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 16,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
  selectField: {
    fontSize: 16,
    justifyContent: "center",
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "#34CB79",
    borderRadius: 10,
    color: "black",
    paddingRight: 30,
    marginBottom: 12,
    height: 60,
  },
});

export default Home;
