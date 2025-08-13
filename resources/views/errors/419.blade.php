@extends('errors.layout.layout')

@section('content')


<div class="error-container mx-auto w-100">
    <i class="fas fa-hourglass-end fa-5x text-warning"></i>
    <h1 style="font-size: 80px; font-weight: bold;">
        419
    </h1>
    <h2 class="mb-3">Página Expirada</h2>
    <p>La sesión ha caducado. Por favor, vuelve a intentarlo.</p>
    <a href="{{ url('/') }}" class="btn btn-error mt-2">
        <i class="fas fa-sync-alt"></i> Recargar Página
    </a>
</div>


@endsection
