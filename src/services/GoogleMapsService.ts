import axios from "axios";

class GoogleMapsService {
  private baseUrl = "https://maps.googleapis.com/maps/api";

  // Método para buscar sugestões de endereços com base no input do usuário
  async getAutocompleteSuggestions(query: string) {
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    try {
      const response = await axios.get(
        `${this.baseUrl}/place/autocomplete/json`,
        {
          params: {
            input: query,
            key: googleMapsApiKey,
            types: "address",
            language: "pt-BR",
          },
        }
      );
      console.log("response google:",response);
      return response.data.predictions;
    } catch (error) {
      console.error("Erro ao buscar sugestões de endereços:", error);
      return [];
    }
  }

  // Método para obter detalhes do endereço selecionado com base no place_id
  async getPlaceDetails(placeId: string) {
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    try {
      const response = await axios.get(`${this.baseUrl}/place/details/json`, {
        params: {
          place_id: placeId,
          key: googleMapsApiKey,
          language: "pt-BR",
        },
      });
      return response.data.result;
    } catch (error) {
      console.error("Erro ao buscar detalhes do local:", error);
      return null;
    }
  }
}

export default new GoogleMapsService();
