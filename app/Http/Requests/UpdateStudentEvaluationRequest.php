<?php

namespace App\Http\Requests;

use App\Models\Question;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class UpdateStudentEvaluationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $submit = $this->boolean('submit');

        return [
            'submit' => ['boolean'],
            'answers' => [$submit ? 'required' : 'nullable', 'array'],
            'answers.*.question_id' => [
                'required',
                'integer',
                Rule::exists('questions', 'id')->where(
                    fn ($query) => $query->where('is_active', true),
                ),
            ],
            'answers.*.score' => [
                $submit ? 'required' : 'nullable',
                'integer',
                'min:1',
                'max:5',
            ],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'submit' => $this->boolean('submit'),
        ]);
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator) {
            if (! $this->boolean('submit')) {
                return;
            }

            $activeQuestionIds = Question::query()
                ->where('is_active', true)
                ->pluck('id')
                ->sort()
                ->values();

            $answeredQuestionIds = collect($this->input('answers', []))
                ->pluck('question_id')
                ->map(fn ($id) => (int) $id)
                ->sort()
                ->values();

            if ($activeQuestionIds->toArray() !== $answeredQuestionIds->toArray()) {
                $validator->errors()->add(
                    'answers',
                    'Semua pertanyaan aktif wajib dijawab sebelum dikirim.',
                );
            }
        });
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'submit.boolean' => 'Status pengiriman tidak valid.',
            'answers.required' => 'Jawaban evaluasi wajib diisi.',
            'answers.array' => 'Format jawaban tidak valid.',
            'answers.*.question_id.required' => 'Pertanyaan wajib diisi.',
            'answers.*.question_id.integer' => 'Pertanyaan tidak valid.',
            'answers.*.question_id.exists' => 'Pertanyaan tidak valid atau tidak aktif.',
            'answers.*.score.required' => 'Skor wajib dipilih untuk setiap pertanyaan.',
            'answers.*.score.integer' => 'Skor harus berupa angka.',
            'answers.*.score.min' => 'Skor minimal 1.',
            'answers.*.score.max' => 'Skor maksimal 5.',
        ];
    }
}
