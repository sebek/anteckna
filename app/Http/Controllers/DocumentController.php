<?php

namespace App\Http\Controllers;

use App\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index()
    {
        $documents = Document::all();

        return ['documents' => $documents];
    }

    public function store(Request $request)
    {
        $document = Document::create(['markdown' => $request->input('markdown')]);

        return $document;
    }

    public function update($id, Request $request)
    {
        $document = Document::find($id)->update($request->all());

        if ($document) {
            return "success";
        }

        return "failed";
    }
}