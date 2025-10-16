<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Sistema Suspendido Temporalmente</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center min-h-screen p-6 text-center">
    <div class="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8">
        <div class="relative w-28 h-28 mx-auto mb-6">
            <svg class="w-full h-full text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="M12 9v4m0 4h.01M4.93 4.93l14.14 14.14M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
            <div class="absolute inset-0 bg-yellow-200 opacity-20 blur-2xl rounded-full"></div>
        </div>

        <h1 class="text-2xl font-bold text-gray-800 mb-3">Acceso temporalmente suspendido</h1>

        <p class="text-gray-600 leading-relaxed mb-6">
            Tu acceso ha sido suspendido temporalmente porque hay un pago pendiente.
            Una vez se confirme tu pago, el acceso será restablecido automáticamente.
        </p>

        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
            Si ya realizaste el pago, por favor espera unos minutos mientras se actualiza tu estado.
        </div>

        {{-- <a href="mailto:soporte@tusistema.com"
           class="inline-block underline text-blue-500 px-5 py-2 rounded-xl font-medium hover:text-blue-700 transition">
           Contactar soporte
        </a> --}}
    </div>

    <footer class="mt-10 text-gray-400 text-xs">
        © {{ now()->year }} — ADP Technology. Todos los derechos reservados.
    </footer>
</body>
</html>
