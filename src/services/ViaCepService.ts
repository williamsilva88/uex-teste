import axios from "axios";

class ViaCepService {
  async consultarCEP(cep:string) {
    const sanitizedCep = cep.replace(/\D/g, "");
    if (sanitizedCep.length !== 8) {
      throw new Error("CEP inválido");
    }

    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${sanitizedCep}/json/`
      );
      return response.data;
    } catch (error) {
      console.error("Erro na consulta ao ViaCEP", error);
      throw new Error("Erro na consulta ao ViaCEP");
    }
  }
}

export default new ViaCepService();
