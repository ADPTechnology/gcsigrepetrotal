@extends('auth.layouts.login-layout')

@section('title', 'Green Care | Login')

@section('content')

<main class="main-content main-login mt-0">

	{{-- <span class="bg-filter"></span> --}}

	<div class="page-header min-vh-100">

		<div class="right-container container">

			@if (session('error'))
			<div class="alert alert-danger">
					{{ session('error') }}
			</div>
			@endif

            @if (session('info'))
            <div class="alert alert-success">
                {{ session('info') }}
            </div>
            @endif

			<div class="right-form-container">

				<div class="cont-txt-login d-flex">
					<img src="{{asset('assets/common/images/logo-greencare.png')}}" alt="">

					<div class="txt-login-subtitle mt-3">
						..:: Acceso al sistema ::..
					</div>
				</div>

				<div class="card-body">
					<form method="POST" action="{{ route('login') }}" role="form" class="text-start login-form">
						@csrf

						<div class="input-box my-4">

							<input id="user_name" name="user_name" type="text"
								class="form-control @error('user_name') is-invalid @enderror" required
								autocomplete="user_name" value="{{old('user_name')}}" placeholder="Nombre de usuario">

							@error('user_name')
							<span class="invalid-feedback ps-3" role="alert">
								<strong>{{ $message }}</strong>
							</span>
							@enderror

						</div>


						<div class="input-box mb-3">

							<input id="password" name="password" type="password" required
								class="form-control @error('user_name') is-invalid @enderror"
								placeholder="Contraseña">
						</div>

						<div class="text-center btn-login-submit">
							<button type="submit" class="btn w-100 my-4 mb-2">INGRESAR</button>
						</div>

					</form>



				</div>

                <span class="btn-forgot-password">
                    <a href="{{ route('password.request') }}">
                        Olvidé mi contraseña
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
