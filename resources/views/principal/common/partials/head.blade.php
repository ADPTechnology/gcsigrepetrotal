<head>
	<meta charset="UTF-8">
	<meta content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no" name="viewport">

	<meta name="csrf-token" content="{{ csrf_token() }}">
	<title>@yield('title', 'Green Care')</title>

    {{-- <link href="https://cdn.datatables.net/v/bs4/dt-1.13.7/r-2.5.0/datatables.min.css" rel="stylesheet"> --}}
    {{-- <link href="https://cdn.datatables.net/v/bs4/jszip-3.10.1/dt-2.0.1/b-3.0.0/b-colvis-3.0.0/b-html5-3.0.0/b-print-3.0.0/fh-4.0.0/r-3.0.0/datatables.min.css" rel="stylesheet"> --}}

	{{-- <link rel="stylesheet" href="{{asset('assets/principal/modules/datatables/DataTables-1.10.16/css/dataTables.bootstrap4.min.css')}}"> --}}

	<!-- General CSS Files -->
	<link rel="stylesheet" href="{{asset('assets/principal/modules/bootstrap/css/bootstrap.min.css')}}">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-datepicker@1.9.0/dist/css/bootstrap-datepicker.min.css">

	@include('scripts.font-awesome')

	<!-- CSS Libraries -->
	<link rel="stylesheet" href="{{asset('assets/principal/modules/jqvmap/dist/jqvmap.min.css')}}">
	<link rel="stylesheet" href="{{asset('assets/principal/modules/summernote/summernote-bs4.css')}}">



    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.13.2/themes/flick/jquery-ui.css">
    {{-- <link rel="stylesheet" href="{{ asset('assets/principal/modules/jquery-ui/jquery-ui.min.css') }}"> --}}
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js"></script>

	{{-- Date range picker --}}
	<link rel="stylesheet" href="{{asset('assets/principal/modules/bootstrap-daterangepicker/daterangepicker.css')}}">

	<!-- Template CSS -->
	<link rel="stylesheet" href="{{asset('assets/principal/css/style.css')}}">
	<link rel="stylesheet" href="{{asset('assets/principal/css/components.css')}}">

	<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />

	<link rel="stylesheet" href="{{asset('assets/principal/css/custom.css')}}?v={{ filemtime('assets/principal/css/custom.css') }}">

	<link rel="stylesheet" href="{{asset('assets/common/css/fonts.css')}}">

    <link href="https://cdn.datatables.net/v/bs4/jszip-3.10.1/dt-2.3.2/b-3.2.4/b-colvis-3.2.4/b-html5-3.2.4/b-print-3.2.4/fh-4.0.3/r-3.0.5/sl-3.0.1/datatables.min.css" rel="stylesheet" >
	{{-- <link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.4.1/css/buttons.dataTables.min.css"> --}}

	@yield('extra-head')

</head>

