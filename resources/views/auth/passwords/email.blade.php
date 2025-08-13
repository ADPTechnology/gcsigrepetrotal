@extends('auth.layouts.login-layout')

@section('content')
    <main class="main-content main-login mt-0">

        <span class="bg-filter"></span>

        <div class="page-header min-vh-100">



            <div class="right-container container">

                @if (session('status'))
                    <div class="alert alert-success" role="alert">
                        {{ session('status') }}
                    </div>
                @endif

                <div class="right-form-container">

                    <div class="cont-txt-login d-flex">
                        <img src="{{ asset('assets/common/images/logo-greencare.png') }}" alt="">
                        <div class="txt-login-subtitle mt-3">
                            ..:: Restablecer contraseña ::..
                        </div>
                    </div>

                    <div class="card-body mt-4">

                        <form method="POST" action="{{ route('password.email') }}" class="text-start login-form">
                            @csrf

                            <div class="input-box mb-3">

                                <input id="email" type="email" placeholder="Ingrese su correo"
                                    class="form-control @error('email') is-invalid @enderror" name="email"
                                    value="{{ old('email') }}" required autocomplete="email" autofocus>

                                @error('email')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror

                            </div>

                            <div class="text-center msg-send-reset">

                                <button type="submit" class="btn btn-primary">
                                    {{ __('Enviar enlace de restablecimientto de contraseña') }}
                                </button>

                            </div>
                        </form>
                    </div>

                    <span class="btn-forgot-password">
                        <a href="{{ route('login') }}">
                            Iniciar sesión
                        </a>
                    </span>

                    <span class="copy-txt-login">
                        &copy; GREEN CARE
                    </span>

                </div>

            </div>




        </div>

    </main>
@endsection
