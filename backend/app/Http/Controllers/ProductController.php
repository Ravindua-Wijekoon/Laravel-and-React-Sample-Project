<?php

namespace App\Http\Controllers;
use App\Models\Product;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('category')->get();

        // Append full URL for photo
        $products->map(function ($product) {
            $product->photo = $product->photo ? asset('storage/' . $product->photo) : null;
            return $product;
        });

        return response()->json($products);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate incoming request
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'quantity' => 'required|integer|min:1',
            'category_id' => 'required|exists:categories,id',
        ]);

        // Handle the uploaded file
        $filePath = null;
        if ($request->hasFile('photo')) {
            $filePath = $request->file('photo')->store('products', 'public');
        }

        // Create the product
        $product = Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'description' => $request->description,
            'photo' => $filePath,
            'quantity' => $request->quantity,
            'category_id' => $request->category_id,
        ]);

        return response()->json($product, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        $product->load('category');
        $product->photo = $product->photo ? asset('storage/' . $product->photo) : null;
        return response()->json($product);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $request->merge($request->all());
        \Log::info('Request Data:', $request->all());

        // Validate input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'quantity' => 'required|integer',
            'category_id' => 'required|exists:categories,id',
        ]);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo if it exists
            if ($product->photo) {
                Storage::disk('public')->delete($product->photo);
            }

            // Store new photo
            $validated['photo'] = $request->file('photo')->store('products', 'public');
        }

        // Update product
        $product->update($validated);

        // Append full photo URL for the response
        $product->photo = $product->photo ? asset('storage/' . $product->photo) : null;

        return response()->json($product);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return response(null, 204);
    }
}