@extends('auth.layouts.login-layout')

@section('content')
    <main class="main-content main-login mt-0">
        <span class="bg-filter"></span>
        <div class="page-header min-vh-100">


            <div class="right-container container">

                <div class="right-form-container">

                    <div class="cont-txt-login d-flex">
                        <img src="{{ asset('assets/common/images/logo-greencare.png') }}" alt="">
                        <div class="txt-login-subtitle mt-3">
                            ..:: Restablecer contraseña ::..
                        </div>
                    </div>

                    <div class="card-body">

                        <form method="POST" action="{{ route('password.update') }}" class="text-start login-form">
                            @csrf

                            <input type="hidden" name="token" value="{{ $token }}">

                            <div class="input-box mt-3 mb-3">

                                <input id="email" type="email" placeholder="Ingrese su correo"
                                    class="form-control @error('email') is-invalid @enderror" name="email"
                                    value="{{ $email ?? old('email') }}" required autocomplete="email">

                                @error('email')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror

                            </div>

                            <div class="input-box mb-3">

                                <input id="password" type="password" placeholder="Contraseña"
                                    class="form-control @error('password') is-invalid @enderror" name="password"
                                    required autocomplete="new-password" autofocus>

                                @error('password')
                                    <span class="invalid-feedback" role="alert">
                                        <strong>{{ $message }}</strong>
                                    </span>
                                @enderror

                            </div>

                            <div class="input-box mb-3">

                                <input id="password-confirm" type="password" class="form-control" placeholder="Confirmar contraseña"
                                    name="password_confirmation" required autocomplete="new-password">

                            </div>

                            <div class="text-center">

                                <button type="submit" class="btn btn-primary">
                                    {{ __('Restablecer contraseña') }}
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
