<?php

namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;

class PdfService
{
    /**
     * Render a PDF from a Blade view.
     *
     * @param  array<string, mixed>  $data
     */
    public function render(
        string $view,
        array $data = [],
        string $orientation = 'landscape',
    ): \Barryvdh\DomPDF\PDF {
        return Pdf::loadView($view, $data)
            ->setPaper('a4', $orientation)
            ->setOptions([
                'dpi'                  => 150,
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled'      => false,
                'chroot'               => public_path(),
            ]);
    }

    /**
     * Return a download response.
     *
     * @param  array<string, mixed>  $data
     */
    public function download(
        string $view,
        array $data,
        string $filename,
        string $orientation = 'landscape',
    ): \Symfony\Component\HttpFoundation\StreamedResponse {
        return $this->render($view, $data, $orientation)->download($filename);
    }

    /**
     * Return an inline (browser preview) response.
     *
     * @param  array<string, mixed>  $data
     */
    public function inline(
        string $view,
        array $data,
        string $filename,
        string $orientation = 'landscape',
    ): \Symfony\Component\HttpFoundation\StreamedResponse {
        return $this->render($view, $data, $orientation)->stream($filename);
    }
}
