
<!-- General JS Scripts -->

<script src="{{asset('assets/common/js/jquery.validator.js')}}"></script>
<script src="{{asset('assets/principal/modules/popper.js')}}"></script>
<script src="{{asset('assets/principal/modules/tooltip.js')}}"></script>
<script src="{{asset('assets/principal/modules/bootstrap/js/bootstrap.bundle.min.js')}}"></script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap-datepicker@1.9.0/dist/js/bootstrap-datepicker.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/locales/bootstrap-datepicker.es.min.js"></script>

<script src="{{ asset('assets/principal/js/jquery.prettynumber.js') }}"></script>

{{-- <script src="{{ asset('assets/principal/modules/jquery-ui/jquery-ui.min.js') }}"></script> --}}

{{--------------- DATATABLES -------------- }}

{{-- <script src="{{asset('assets/principal/modules/datatables/datatables.min.js')}}"></script>
<script src="{{asset('assets/principal/modules/datatables/DataTables-1.10.16/js/dataTables.bootstrap4.min.js')}}"></script> --}}
{{-- <script src="https://cdn.datatables.net/v/bs4/dt-1.13.7/r-2.5.0/datatables.min.js"></script>
<script src="https://cdn.datatables.net/buttons/2.4.1/js/dataTables.buttons.min.js"></script>
<script src="{{asset('vendor/datatables/buttons.server-side.js')}}"></script> --}}

<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js"></script>

<script src="https://cdn.datatables.net/v/bs4/jszip-3.10.1/dt-2.3.7/b-3.2.6/b-colvis-3.2.6/b-html5-3.2.6/b-print-3.2.6/fc-5.0.5/fh-4.0.6/r-3.0.8/sl-3.1.3/datatables.min.js" integrity="sha384-E0w1/me6FQbK+4vUv+w0w2++Np8/8L9wxpLiHcJJ20OHLYSPKsGzgvroWgMony5c" crossorigin="anonymous"></script>

<script src="{{asset('assets/principal/modules/nicescroll/jquery.nicescroll.min.js')}}"></script>
<script src="{{asset('assets/principal/modules/moment.min.js')}}"></script>
<script src="{{asset('assets/principal/js/stisla.js')}}"></script>


{{-- Date range picker  --}}

<script src="{{asset('assets/principal/modules/bootstrap-daterangepicker/daterangepicker.js')}}"></script>

<!-- JS Libraies -->

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="{{asset('assets/principal/modules/jquery.sparkline.min.js')}}"></script>

<!-- ChartJs --->
<script src="{{asset('assets/principal/modules/chart.min.js')}}"></script>

<script src="{{asset('assets/principal/modules/summernote/summernote-bs4.js')}}"></script>
<script src="{{asset('assets/principal/modules/chocolat/dist/js/jquery.chocolat.min.js')}}"></script>
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>

<!-- Page Specific JS File -->

<!-- Template JS File -->


<script src="{{asset('assets/principal/js/scripts.js')}}"></script>

<script src="{{asset('assets/principal/js/custom.js')}}?v={{ filemtime(public_path('assets/principal/js/custom.js')) }}" type="module"></script>


@yield('extra-script')
