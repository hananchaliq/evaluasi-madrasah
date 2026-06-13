<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'type',
    'title',
    'message',
    'severity',
    'reference_type',
    'reference_id',
    'is_read',
    'read_at',
])]
class Notification extends Model
{
    public const TYPE_EVALUATION_PERIOD_NEW = 'evaluation_period_new';

    public const TYPE_EVALUATION_DEADLINE = 'evaluation_deadline';

    public const TYPE_EVALUATION_COMPLETED = 'evaluation_completed';

    public const SEVERITY_INFO = 'info';

    public const SEVERITY_WARNING = 'warning';

    public const SEVERITY_SUCCESS = 'success';

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'read_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
