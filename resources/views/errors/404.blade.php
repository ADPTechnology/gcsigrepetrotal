@extends('errors.layout.layout')

@section('content')
    <div class="error-container mx-auto w-100">
        <i class="fa-solid fa-triangle-exclamation fa-5x text-danger"></i>
        <h1 style="font-size: 80px; font-weight: bold;">
            404
        </h1>
        <h2 class="mb-3">Página no encontrada</h2>
        <p>La página que quieres visitar no existe.</p>
        <a href="{{ url('/') }}" class="btn btn-error mt-2">
            <i class="fas fa-home"></i> Volver al Inicio
        </a>
    </div>
@endsection
