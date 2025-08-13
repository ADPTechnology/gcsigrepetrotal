<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ForgotPasswordMail extends Mailable
{
    use Queueable, SerializesModels;
    public $action_link;

    public function __construct($action_link)
    {
        $this->action_link = $action_link;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('(no-reply) Notificación de restablecimiento de contraseña')->markdown('emails.resetPasswordNotification');
    }
}
