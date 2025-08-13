@foreach ($months as $month)
<option value="{{ $month }}" selected>{{ config('parameters.months_n_es')[$month] }}</option>
@endforeach
