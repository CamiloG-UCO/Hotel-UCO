export function resolveApiError(error: unknown): string {
  if (!error) {
    return 'Se produjo un error desconocido.';
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  const maybeResponse = error as {
    status?: number;
    error?: { message?: string; error?: string } | string;
  };

  if (maybeResponse?.status === 0) {
    return 'No fue posible conectar con el servicio. Asegúrate de que esté disponible en el puerto 8081.';
  }

  if (typeof maybeResponse?.error === 'string') {
    return maybeResponse.error;
  }

  if (maybeResponse?.error && typeof maybeResponse.error === 'object') {
    return (
      maybeResponse.error.message ||
      maybeResponse.error.error ||
      'Ocurrió un error en la solicitud.'
    );
  }

  return 'Ocurrió un error en la solicitud.';
}
