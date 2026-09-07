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
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,

            'total_pon_ports' => $this->total_pon_ports,

            'pon_ports_count' => $this->whenCounted('ponPorts'),

            'pon_ports' => $this->whenLoaded(
                'ponPorts',
                fn () => $this->ponPorts->map(
                    fn ($ponPort): array => [
                        'id' => $ponPort->id,
                        'name' => $ponPort->name,
                        'port_number' => $ponPort->port_number,
                        'capacity' => $ponPort->capacity,
                        'status' => $ponPort->status,
                        'description' => $ponPort->description,
                    ]
                )
            ),

            'status' => $this->status,
            'description' => $this->description,

            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'deleted_at' => $this->deleted_at?->toISOString(),
        ];
    }
}
