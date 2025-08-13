<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Green Care</title>

	@include('scripts.font-awesome')

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">
    <link rel="stylesheet" href="{{asset('assets/common/css/fonts.css')}}">

    <link rel="stylesheet" href="{{ asset('assets/errors/errors.css') }}">
</head>
<body>

    <main class="min-vh-100 w-100 d-flex align-items-center">

        @yield('content')

    </main>

</body>
</html>
