<x-mail::message>
# Đặt lại mật khẩu

<p style="margin: 0 0 12px 0; font-size: 16px; line-height: 24px; color: #111827;">
Chào bạn,
</p>

<p style="margin: 0 0 16px 0; font-size: 16px; line-height: 24px; color: #111827;">
Mã OTP của bạn là:
</p>

<div style="text-align:center; margin: 18px 0 20px 0;">
  <div style="
      display:inline-block;
      padding: 14px 18px;
      border-radius: 14px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
    ">
    <span style="
        font-size: 34px;
        line-height: 40px;
        font-weight: 800;
        letter-spacing: 8px;
        color: #166534;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
      ">
      {{ $otp }}
    </span>
  </div>
</div>

<p style="margin: 0 0 16px 0; font-size: 14px; line-height: 22px; color: #374151;">
Mã này có hiệu lực trong <strong>2 phút</strong>.
</p>

<div style="
    margin: 0 0 16px 0;
    padding: 12px 14px;
    border-left: 4px solid #f59e0b;
    background: #fffbeb;
    border-radius: 10px;
  ">
  <p style="margin:0; font-size: 14px; line-height: 22px; color: #92400e;">
    Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
  </p>
</div>

<p style="margin: 0; font-size: 14px; line-height: 22px; color: #6b7280;">
Trân trọng,<br>
{{ config('app.name') }}
</p>
</x-mail::message>
