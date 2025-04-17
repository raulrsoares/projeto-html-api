import { Request, Response, NextFunction } from 'express';
import prismaClient from '../prisma/prisma';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from '../middlewares/errorHandler';
import axios from 'axios';

export class ClimaController {
  constructor() {
    this.getCustomerClima = this.getCustomerClima.bind(this);
  }

  async getCustomerClima(req: Request, res: Response, next: NextFunction) {
    try {
      const { user_id } = req.params as { user_id: string };
      if (!user_id) {
        throw new UnauthorizedError('preencha todos os parâmetros');
      }

      const weatherbitApiKey = process.env.WEATHERBIT_API_KEY;

      if (!weatherbitApiKey) {
        throw new UnauthorizedError();
      }

      const customer = await prismaClient.customer.findMany({
        where: { id: user_id },
      });

      if (!customer) {
        throw new NotFoundError('cliente não existe');
      }

      const { endereco, estado } = customer[0];

      const estadoSplit = estado.split('-');
      const localidade = estadoSplit[0].trim();
      const uf = estadoSplit[1].trim();

      const nominatimUrl = `https://nominatim.openstreetmap.org/search`;
      const geoResponse = await axios.get(nominatimUrl, {
        params: {
          street: endereco,
          city: localidade,
          state: uf,
          country: 'Brazil',
          format: 'json',
        },
        headers: {
          'User-Agent': 'WeatherApp/1.0',
        },
      });

      const { lat, lon } = geoResponse.data[0];

      const weatherbitUrl = `https://api.weatherbit.io/v2.0/current`;
      const weatherResponse = await axios.get(weatherbitUrl, {
        params: {
          lat,
          lon,
          key: weatherbitApiKey,
        },
      });

      const data = weatherResponse.data.data[0];
      console.log(`Tempo atual em ${localidade}/${uf}:`);
      console.log(`Descrição: ${data.weather.description}`);
      console.log(`Temperatura: ${data.temp}°C`);
      console.log(`Umidade: ${data.rh}%`);
      console.log(`Vento: ${data.wind_spd} m/s`);

      const body = {
        location: `${localidade}/${uf}:`,
        description: data.weather.description,
        temp: data.temp,
        humidity: data.rh,
        wind_spd: data.wind_spd,
      };

      res.status(200).json({ data: body });
    } catch (error) {
      next(error);
    }
  }
}
