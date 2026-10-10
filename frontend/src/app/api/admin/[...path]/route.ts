import { NextRequest, NextResponse } from 'next/server';
import { readAuthToken, clearAuthCookie } from '@/lib/auth/cookie';
import { laravelFetch } from '@/lib/auth/laravel';
import { assertSameOrigin } from '@/lib/auth/origin';
import { isSafeAdminPath } from '@/lib/auth/path-guard';
import { HttpStatus } from '@/lib/http';

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

async function handleProxy(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;

  if (!isSafeAdminPath(path)) {
    return NextResponse.json({ message: 'Forbidden.' }, { status: HttpStatus.FORBIDDEN });
  }

  const token = await readAuthToken();
  if (!token) {
    return NextResponse.json({ message: 'Unauthenticated.' }, { status: HttpStatus.UNAUTHORIZED });
  }

  const originError = assertSameOrigin(request);
  if (originError) return originError;

  const endpointPath = `/admin/${path.join('/')}`;
  const urlObj = new URL(request.url);
  const searchString = urlObj.search;
  const upstreamEndpoint = `${endpointPath}${searchString}`;

  const method = request.method.toUpperCase();
  let body: BodyInit | null = null;

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      body = await request.formData();
    } else {
      try {
        body = await request.text();
      } catch {
        body = null;
      }
    }
  }

  const upstreamHeaders = new Headers();
  const contentType = request.headers.get('content-type');
  if (contentType) {
    upstreamHeaders.set('Content-Type', contentType);
  }
  const accept = request.headers.get('accept');
  if (accept) {
    upstreamHeaders.set('Accept', accept);
  }
  const acceptLang = request.headers.get('accept-language');
  if (acceptLang) {
    upstreamHeaders.set('Accept-Language', acceptLang);
  }

  const res = await laravelFetch(upstreamEndpoint, {
    method,
    headers: upstreamHeaders,
    body: body as any,
    token,
  });

  if (res.status === HttpStatus.UNAUTHORIZED) {
    await clearAuthCookie();
    return NextResponse.json({ message: 'Unauthenticated.' }, { status: HttpStatus.UNAUTHORIZED });
  }

  if (res.status === HttpStatus.NO_CONTENT || res.status === 204) {
    const response = new NextResponse(null, { status: HttpStatus.NO_CONTENT });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  }

  const responseContentType = res.headers.get('content-type') || 'application/json';
  const responseHeaders = new Headers();
  responseHeaders.set('Content-Type', responseContentType);
  responseHeaders.set('Cache-Control', 'no-store');

  const responseBody =
    responseContentType.includes('application/json') && typeof res.body === 'object'
      ? JSON.stringify(res.body)
      : res.body;

  return new NextResponse(responseBody as any, {
    status: res.status,
    headers: responseHeaders,
  });
}

export async function GET(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return handleProxy(request, context);
}
