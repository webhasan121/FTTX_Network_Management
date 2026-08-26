<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    private const STATUSES = [
        'active' => 'Active',
        'inactive' => 'Inactive',
    ];

    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Customer::class);

        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status')->trim()->toString();

        $status = array_key_exists($status, self::STATUSES)
            ? $status
            : '';

        $customers = Customer::query()
            ->withCount([
                'connections',
                'connections as active_connections_count' => function ($query) {
                    $query->where('status', 'active');
                },
            ])
            ->when(
                $search !== '',
                function (Builder $query) use ($search): void {
                    $query->where(function (Builder $query) use ($search): void {
                        $query
                            ->where('customer_code', 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%")
                            ->orWhere('area', 'like', "%{$search}%")
                            ->orWhere('address', 'like', "%{$search}%");
                    });
                }
            )
            ->when(
                $status !== '',
                fn (Builder $query): Builder =>
                    $query->where('status', $status)
            )
            ->latest('updated_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Customer/Index', [
            'customers' => $customers,

            'filters' => [
                'search' => $search,
                'status' => $status,
            ],

            'statuses' => $this->statusOptions(),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Customer::class);

        return Inertia::render('Customer/Create', [
            'customer' => $this->blankFormData(),
            'statuses' => $this->statusOptions(),
        ]);
    }

    public function store(
        StoreCustomerRequest $request
    ): RedirectResponse {
        $customer = Customer::create(
            $request->validated()
        );

        return redirect()
            ->route('customers.show', $customer)
            ->with(
                'success',
                'Customer created successfully.'
            );
    }

    public function show(Customer $customer): Response
    {
        Gate::authorize('view', $customer);

        $customer->load([
            'connections' => function ($query): void {
                $query
                    ->with([
                        'onu.distributionPoint.splitter.ponPort.olt',
                    ])
                    ->latest('created_at');
            },
        ]);

        return Inertia::render('Customer/Show', [
            'customer' => [
                ...$customer->toArray(),

                'status_label' =>
                    self::STATUSES[$customer->status]
                    ?? $customer->status,

                'created_at' =>
                    $customer->created_at
                        ?->toDayDateTimeString(),

                'updated_at' =>
                    $customer->updated_at
                        ?->toDayDateTimeString(),
            ],
        ]);
    }

    public function edit(Customer $customer): Response
    {
        Gate::authorize('update', $customer);

        return Inertia::render('Customer/Edit', [
            'customer' => $this->formData($customer),
            'statuses' => $this->statusOptions(),
        ]);
    }

    public function update(
        UpdateCustomerRequest $request,
        Customer $customer
    ): RedirectResponse {
        $customer->update(
            $request->validated()
        );

        return redirect()
            ->route('customers.show', $customer)
            ->with(
                'success',
                'Customer updated successfully.'
            );
    }

    public function destroy(
        Customer $customer
    ): RedirectResponse {
        Gate::authorize('delete', $customer);

        if ($customer->connections()->exists()) {
            return back()->with(
                'error',
                'This customer cannot be deleted because connection records are associated with it.'
            );
        }

        $customer->delete();

        return redirect()
            ->route('customers.index')
            ->with(
                'success',
                'Customer deleted successfully.'
            );
    }

    private function formData(Customer $customer): array
    {
        return [
            'id' => $customer->id,
            'customer_code' => $customer->customer_code,
            'name' => $customer->name,
            'phone' => $customer->phone,
            'email' => $customer->email,
            'address' => $customer->address,
            'area' => $customer->area,
            'latitude' => $customer->latitude,
            'longitude' => $customer->longitude,
            'status' => $customer->status,
        ];
    }

    private function blankFormData(): array
    {
        return [
            'customer_code' => '',
            'name' => '',
            'phone' => '',
            'email' => '',
            'address' => '',
            'area' => '',
            'latitude' => '',
            'longitude' => '',
            'status' => 'active',
        ];
    }

    private function statusOptions(): array
    {
        return collect(self::STATUSES)
            ->map(
                fn (
                    string $label,
                    string $value
                ): array => [
                    'value' => $value,
                    'label' => $label,
                ]
            )
            ->values()
            ->all();
    }
}
