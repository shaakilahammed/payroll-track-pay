<?php

namespace App\Mail;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DailyMail extends Mailable
{
    use Queueable, SerializesModels;
    /**
     * Create a new message instance.
     */
    public $emailData;
    public $superAdmin;
    public function __construct($emailData, $superAdmin)
    {
        $this->emailData = $emailData;
        $this->superAdmin = $superAdmin;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Daily Update () - ' . Carbon::now()
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.daily-mail',
            with: ['workingEmployees' => $this->emailData['workingEmployees'],
                    'statistics' => $this->emailData['statistics'],
                    'incompleteProjects' => $this->emailData['incompleteProjects'],
                    'message' => $this->emailData['message'],
                    'superAdminName' => $this->superAdmin->name,
                    'settings' => $this->emailData['generalSettings'],
                ],
        );
    }


    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
