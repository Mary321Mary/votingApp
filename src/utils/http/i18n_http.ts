import axios, {
  type AxiosInstance,
} from "axios";
import Config from "react-native-config";

export class I18nHttpClient {
  private static instance: AxiosInstance;

  static get Client(): AxiosInstance {
    if (!I18nHttpClient.instance) {
      I18nHttpClient.instance = axios.create({
        baseURL: Config.REACT_APP_I18N_BASE_URL,
        headers: {
          "Content-type": "application/json",
        },
      });
    }

    return I18nHttpClient.instance;
  }
}
