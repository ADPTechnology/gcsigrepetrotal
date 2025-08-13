@extends('errors.layout.layout')

@section('content')

<div class="error-container mx-auto w-100">
    <i class="fas fa-ban fa-5x text-danger"></i>
    <h1 style="font-size: 80px; font-weight: bold;">
        403
    </h1>
    <h2 class="mb-3">Acceso Denegado</h2>
    <p>No tienes permisos para ver esta página.</p>
    <a href="{{ url('/') }}" class="btn btn-error mt-2">
        <i class="fas fa-home"></i> Volver al Inicio
    </a>
</div>

@endsection
