import { Alert } from 'antd';
import { useEffect, useState } from 'react';
import Fader from '../components/Fader';

function useRequest(
  func,
  options = {
    values: {},
    autoStart: false,
    clearErrorMessageOnFetch: true,
    clearSuccessMessageOnFetch: true,
    clearDataOnFetch: true,
    alertStyle: {},
    alertIcon: true,
  }
) {
  const [state, setState] = useState({
    loading: false,
    errorMessage: undefined,
    successMessage: undefined,
    data: undefined,
  });

  const clear = () => {
    setState({
      loading: false,
      errorMessage: undefined,
      successMessage: undefined,
      data: undefined,
    });
  };

  const fetch = async (newValues = options?.values) => {
    const {
      clearErrorMessageOnFetch = true,
      clearSuccessMessageOnFetch = true,
      clearDataOnFetch = true,
    } = options;
    setState({
      ...state,
      loading: true,
      errorMessage: clearErrorMessageOnFetch ? undefined : state.errorMessage,
      successMessage: clearSuccessMessageOnFetch
        ? undefined
        : state.successMessage,
      data: clearDataOnFetch ? undefined : state.data,
    });

    let data;
    let errorMessage = '';
    let successMessage = '';

    try {
      data = await func(newValues);
      if (data?.successMessage) {
        successMessage = data.successMessage;
      }
    } catch (e) {
      errorMessage = e.message;
    }

    setState((currentState) => ({
      ...currentState,
      loading: false,
      data,
      errorMessage,
      successMessage,
    }));

    return data;
  };

  useEffect(() => {
    if (options.autoStart) {
      void fetch();
    }

    return () => {
      // clear on unmount
      setState({
        loading: false,
        errorMessage: undefined,
        successMessage: undefined,
        data: undefined,
      });
    };
  }, []);

  const ErrorMessageAlert = state.errorMessage ? (
    <Fader>
      <Alert
        showIcon={options?.alertIcon}
        style={options?.alertStyle}
        type='error'
        message={state.errorMessage}
      />
    </Fader>
  ) : null;

  const SuccessMessageAlert = state.successMessage ? (
    <Fader>
      <Alert
        showIcon={options?.alertIcon}
        style={options?.alertStyle}
        type='success'
        message={state.successMessage}
      />
    </Fader>
  ) : null;

  return { ...state, ErrorMessageAlert, SuccessMessageAlert, fetch, clear };
}

export default useRequest;
