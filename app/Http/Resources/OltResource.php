<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OltResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'vendor' => $this->vendor,
            'model' => $this->model,
            'ip_address' => $this->ip_address,
            'location_name' => $this->location_name,

            'total_pon_ports' => $this->total_pon_ports,
            'pon_ports_count' => $this->pon_ports_count,

            'status' => $this->status,

            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
