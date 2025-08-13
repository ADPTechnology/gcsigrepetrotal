@component('mail::message')
# Estimado:

Está recibiendo este correo electrónico porque recibimos una solicitud de restablecimiento de contraseña para su cuenta.


@component('mail::button', ['url' => $action_link, 'color' => 'primary'])
Restablecer contraseña
@endcomponent


Este enlace para restablecer la contraseña caducará en 60 minutos.
<br>
Si no solicitó un restablecimiento de contraseña, no es necesario realizar ninguna otra acción.

Saludos,<br>
SIGRE-Malvinas

@isset($action_link)
@slot('subcopy')
@lang(
    "Si tienes problemas con el botón \":actionText\", copia y pega la siguiente URL\n".
    'en tu navegador:',
    [
        'actionText' => 'Restablecer contraseña',
    ]
) <span class="break-all">{{ $action_link }}</span>
@endslot
@endisset

{{-- @component('mail::button', ['url' => ''])
Button Text
@endcomponent --}}

@endcomponent
