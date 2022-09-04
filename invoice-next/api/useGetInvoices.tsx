import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useSWR from 'swr';

const useGetInvoices = () => {
  const [data, setData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const { getAccessTokenSilently } = useAuth0();

  const callApi = async () => {
    try {
      const response = await fetch(`${serverUrl}/api/messages/public-message`);

      const responseData = await response.json();

      setData(responseData.message);
    } catch (error: any) {
      setData(error.message);
    }
  };
  const state = { data, isLoading, error };

  return {
    state,
    fetchData: callApi,
    setData,
  };



}

const useSwrGetInvoices = ({id, fetcher}: {id: string, fetcher: any}) => {
  const { data, error } = useSWR(`/api/user/${id}`, fetcher)

  return {
    user: data,
    isLoading: !error && !data,
    isError: error
  }
}