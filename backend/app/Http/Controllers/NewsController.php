<?php

namespace App\Http\Controllers;
use App\Models\News;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NewsController extends Controller
{
    /**
     * Show all the news in a single json response (why?)
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function index() {
        return response()->json(News::orderBy('created_at', 'desc')->get());
    }

    /**
     * Store (create) a new news in the database, only accessible by admins
     * @param \Illuminate\Http\Request $request
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function store(Request $request) {
        // If unauthorized or no admin rights -> return eror 403
        if (!Auth::check() || Auth::user()->rights !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Validate request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'thumbnail' => 'image|mimes:webp,jpg,jpeg|extensions:webp,jpg,jpeg|max:2048',
            'category' => 'required|in:other,update,announcement',
        ]);

        // Validation handles the file extension, so now it is safe to save the file in storage
        // cant use $validated because it is an array, which doesnt have file method
        if($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
        } else {
            $path = 'thumbnails/defaultThumbnail.webp'; //DEFAULT LINK
        }

        // replace file in the array with a path
        $validated['thumbnail'] = $path;

        // Create news post
        $news = News::create($validated);

        return response()->json($news, 201);
    }

    /**
     * Show a single news article by id property
     * @param mixed $id
     * @return mixed|\Illuminate\Http\JsonResponse
     */
    public function show($id) {
        return response()->json(News::findOrFail($id));
    }

    /**
     * Update an existing news article (admin-only).
     */
    public function update(Request $request, $id)
    {
        if (!Auth::check() || Auth::user()->rights !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $news = News::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'thumbnail' => 'sometimes|image|mimes:webp,jpg,jpeg|max:2048',
            'category' => 'sometimes|required|in:other,update,announcement',
        ]);

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')
                ->store('thumbnails', 'public');
        }

        $news->update($validated);

        return response()->json($news);
    }

    /**
     * Delete a news article (admin-only).
     */
    public function destroy($id)
    {
        if (!Auth::check() || Auth::user()->rights !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $news = News::findOrFail($id);
        $news->delete();

        return response()->json(['message' => 'Deleted'], 200);
    }
}
